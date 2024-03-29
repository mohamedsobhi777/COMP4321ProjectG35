import java.util.*;
import org.htmlparser.beans.StringBean;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.filters.AndFilter;
import org.htmlparser.filters.NodeClassFilter;
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


public class Crawler {
    private Queue<String> urlQueue = new LinkedList<>(); //urlQueue(Queue): Storing the URL to be crawled
    private HashSet urlSet = new HashSet<String>(); //urlSet: Storing the URL explored
    private static int crawlDepth = 0;  //Total of number of web pages to be crawled


    // Format the date and time
    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private String formattedDateTime = LocalDateTime.now().format(formatter);

    //Data member for interacting with the database
    private static final String uri = "mongodb+srv://chhuiwork:COMP4321haha@cluster0.mncnodn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    private MongoClient mongoClient = MongoClients.create(uri);
    private MongoDatabase database = mongoClient.getDatabase("COMP4321");
    private MongoCollection<Document> pageInfo = database.getCollection("pageInfo");
    public Crawler(String initialUrl, int crawlDepth){    //Constructor
        this.crawlDepth = crawlDepth;
        if(!initialUrl.isEmpty()){
            urlQueue.add(initialUrl);
        }
    }

    public Vector<String> extractLinks() throws ParserException{
        Vector<String> linkExtracted = new Vector<String>();  //Vector storing the url extracted
        LinkBean lb = new LinkBean();
        int numFileCrawled = 0;


        while(urlQueue.peek() != null) {
            lb.setURL(urlQueue.poll());
            URL[] urlArray = lb.getLinks();
            for(int i = 0; i < urlArray.length && numFileCrawled< crawlDepth; i++){
                String retrievedURL = urlArray[i].toString();
                if(!urlSet.contains(retrievedURL)) { //condition going to be refactored (use for testing only)
                    System.out.println(pageInfo.countDocuments(new Document("URL", retrievedURL)));
                    if(pageInfo.countDocuments(new Document("URL", retrievedURL)) == 0) { //Check
                        pageInfo.insertOne(new Document()
                                .append("PageID", numFileCrawled)
                                .append("URL", retrievedURL)
                                .append("LastCrawledDate", formattedDateTime));
                    }
                    numFileCrawled++;
                    urlSet.add(retrievedURL);
                    linkExtracted.add(retrievedURL);
                    urlQueue.add(retrievedURL);
                }
            }
        }
        return linkExtracted;
    }
    public static void main (String[] args)
    {
        try
        {
            String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/testpage.htm";
            Crawler crawler = new Crawler(testURL, 30);

            Vector<String> links = crawler.extractLinks();
            System.out.println("Links in "+testURL+":");
            for(int i = 0; i < links.size(); i++)
                System.out.println(links.get(i));
            System.out.println("");

        } catch (ParserException e)
        {
            e.printStackTrace ();
        }

    }


}
