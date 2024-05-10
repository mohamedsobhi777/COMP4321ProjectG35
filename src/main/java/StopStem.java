import IRUtilities.Porter;

import java.io.*;
import java.util.HashSet;

public class StopStem
{
	private Porter porter;
	private HashSet<String> stopWords;
	public boolean isStopWord(String str)
	{
		return stopWords.contains(str);	
	}
	public StopStem(String str)
	{
		super();
		porter = new Porter();
		stopWords = new HashSet<String>();
		BufferedReader bs = null;
		// use BufferedReader to extract the stopwords in stopwords.txt (path passed as parameter str)
		// add them to HashSet<String> stopWords
		// MODIFY THE BELOW CODE AND ADD YOUR CODES HERE
		try{
			FileReader fs = new FileReader(str);
			bs = new BufferedReader(fs);
		}
		catch (FileNotFoundException e){
			e.printStackTrace();
		}
		try{
			String line = null;
			while((line = bs.readLine())!=null){
				stopWords.add(line);
			}
		} catch (IOException e){
			e.printStackTrace();
		}



	}
	public String stem(String str)
	{
		return porter.stripAffixes(str);
	}

}
