import java.io.IOException;
import java.util.*;

import org.htmlparser.beans.FilterBean;
import org.htmlparser.beans.StringBean;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.filters.AndFilter;
import org.htmlparser.filters.NodeClassFilter;
import org.htmlparser.filters.TagNameFilter;
import org.htmlparser.tags.LinkTag;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;
import org.htmlparser.beans.LinkBean;
import java.net.URL;
import java.util.Arrays;
import org.bson.Document;
import org.bson.types.ObjectId;
import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;
import static com.mongodb.client.model.Filters.eq;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.net.URL;
import java.net.URLConnection;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import org.bson.Document;
import org.bson.conversions.Bson;
import com.mongodb.client.model.Updates;


public class Crawler {
    private Queue<String> urlQueue = new LinkedList<>(); //urlQueue(Queue): Storing the URL to be crawled
    private HashSet urlSet = new HashSet<String>(); //urlSet: Storing the URL explored
    private HashMap<String, Vector<String>> parentChildLink = new HashMap<String, Vector<String>>();
    private static int crawlDepth = 0;  //Total of number of web pages to be crawled
    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");  // Format the date and time
    private String formattedDateTime = LocalDateTime.now().format(formatter);
    private static final String uri = testProgram.database;
    private MongoClient mongoClient = MongoClients.create(uri);
    private MongoDatabase database = mongoClient.getDatabase("COMP4321");
    private MongoCollection<Document> pageInfo = database.getCollection("pageInfo");

    public Crawler(String initialUrl, int crawlDepth){    //Constructor
        this.crawlDepth = crawlDepth;
        if(!initialUrl.isEmpty()){
            urlQueue.add(initialUrl);
        }
    }

    public void extractLinks() throws ParserException, IOException {
        LinkBean lb = new LinkBean();                         //Create the LinkBean object
        int numFileCrawled = 0;                               //Number of file processed


        while(urlQueue.peek() != null && numFileCrawled < crawlDepth) {

            //Get one URL out of the queue
            String currentRetrievedURL = urlQueue.poll();

            //Check if the URL retrieved has been retrieved or not
            if(!urlSet.contains(currentRetrievedURL)){
                urlSet.add(currentRetrievedURL);
                numFileCrawled++;
            }
            else{
                continue;
            }


            lb.setURL(currentRetrievedURL);
            URL[] urlArray = lb.getLinks();
            String[] childLinkArrays = new String[urlArray.length];
            for(int i = 0; i < urlArray.length; i++){ //Add them to the url queue
                String childLinks = urlArray[i].toString();
                childLinkArrays[i] = childLinks;
                urlQueue.add(childLinkArrays[i]);
                if(parentChildLink.containsKey(childLinks)){
                    Vector<String> parentLinkVector = parentChildLink.get(childLinks);
                    if(!parentLinkVector.contains(currentRetrievedURL)) {
                        parentLinkVector.addElement(currentRetrievedURL);
                        parentChildLink.put(childLinks, parentLinkVector);
                    }
                }
                else{
                    Vector<String> parentLinkVector = new Vector<String>();
                    parentLinkVector.addElement(currentRetrievedURL);
                    parentChildLink.put(childLinks, parentLinkVector);
                }
            }

            //Check if the currentRetrievedURL is in the db or not
            if((pageInfo.countDocuments(new Document("_id", currentRetrievedURL)) == 0 ))
            {

                //Extract the word from the webpages
                StringBean sb = new StringBean();                           //Create the StringBean object
                sb.setURL(currentRetrievedURL);                             //Set the url of the StringBean
                sb.setLinks(false);                                         //Should not crawl the links
                StringTokenizer st = new StringTokenizer(sb.getStrings());
                Vector<String> wordExtracted = new Vector<String>();
                while(st.hasMoreTokens()){
                    wordExtracted.add(st.nextToken());
                }


                //Extract the title from the webpages
                FilterBean fb = new FilterBean();                          //Create the FilterBean object
                fb.setURL(currentRetrievedURL);                            //Set the url for the FilterBean
                fb.setFilters(new NodeFilter[]{new TagNameFilter("Title")});    //Want to crawl the element inside <title> tag


                //Extract the last modified page of the webpage
                URL url = new URL(currentRetrievedURL);                         //Get the last modified date of the web page
                URLConnection connection = url.openConnection();
                String lastModified = connection.getHeaderField("Last-Modified");
                if(lastModified == null){
                    lastModified = connection.getDate() + "";
                }


                //Create new document and put into it
                pageInfo.insertOne(new Document()                               //Insert into the mongoDB database
                        .append("Title", fb.getText())
                        .append("_id", currentRetrievedURL)
                        .append("lastModifiedDate", lastModified)
                        .append("PageSize", wordExtracted.size())
                        .append("LastCrawledDate", formattedDateTime)
                        .append("ChildLink", Arrays.asList(childLinkArrays)));;

                Indexer pageIndexer = new Indexer(currentRetrievedURL);


                pageIndexer.extractWords();

//                try {
//                    FileWriter writer = new FileWriter("spider_result.txt", true); // Append mode
//                    //Outputting of the crawling result
//                    writer.write(fb.getText());
//                    writer.write(System.lineSeparator()); // Add a new line
//                    writer.write(currentRetrievedURL);
//                    writer.write(System.lineSeparator()); // Add a new line
//                    writer.write(lastModified + ", " + wordExtracted.size());
//                    writer.write(System.lineSeparator()); // Add a new line
//
//                    // Write the word frequencies to the file
//                    StringBuilder frequencyBuilder = new StringBuilder();
//                    for (Map.Entry<String, Posting> entry : pageIndexer.combinedFrequencyMap.entrySet()) {
//                        frequencyBuilder.append(entry.getKey()).append(" ").append(entry.getValue().getTermFrequency()).append("; ");
//                    }
//                    writer.write(frequencyBuilder.toString().trim());
//                    writer.write(System.lineSeparator()); // Add a new line
//
//                    for (int i = 0; i < childLinkArrays.length && i < 10; i++) {
//                        writer.write(childLinkArrays[i]);
//                        writer.write(System.lineSeparator()); // Add a new line
//                    }
//                    writer.write("---------------------------------");
//                    writer.write(System.lineSeparator()); // Add a new line
//                    writer.flush();
//                    writer.close();
//                } catch (IOException e) {
//                    System.out.println("An error occurred.");
//                    e.printStackTrace();
//                }

            }
        }
        Iterator it = parentChildLink.entrySet().iterator();
        while(it.hasNext()){
            Map.Entry pair = (Map.Entry) it.next();
            Bson filter = eq("_id", pair.getKey());
            if(pageInfo.countDocuments(filter) != 0) {
                Document doc = pageInfo.find(filter).first();
                Document replacement = new Document(doc).append("parent_link", pair.getValue());
                System.out.println(replacement);
                pageInfo.replaceOne(filter, replacement);
            }
        }
    }
//    public static void main (String[] args)
//    {
//        try
//        {
//            String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/testpage.htm";
//            Crawler crawler = new Crawler(testURL, 30);
//
//            crawler.extractLinks();
//
//        } catch (ParserException | IOException e)
//        {
//            e.printStackTrace ();
//        }
//
//    }


}
